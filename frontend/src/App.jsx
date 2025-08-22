import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Pagination } from "react-bootstrap";
import './App.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [finished, setFinished] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchTodos(1);
  }, [searchQuery]);

  const fetchTodos = async (currentPage = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/todos?page=${currentPage}&limit=${limit}&q=${searchQuery}`
      );
      setTodos(res.data.items);
      setPages(res.data.pages);
      setPage(currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setErrors("");
    setName("");
    const today = new Date().toISOString().slice(0, 10);
    setDateStart(today);
    setFinished(false);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (todo) => {
    setErrors("");
    setName(todo.name);
    setDateStart(todo.date_start?.slice(0, 10) || "");
    setFinished(todo.finished || false);
    setEditId(todo.id || todo._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!dateStart) newErrors.dateStart = "Date Start is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/todos/${editId}`, {
          name,
          date_start: dateStart,
          finished,
        });
      } else {
        await axios.post("http://localhost:5000/api/todos", {
          name,
          date_start: dateStart,
          finished: false,
        });
      }

      setShowModal(false);
      setErrors({});
      fetchTodos(page);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos(page);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pages) return;

    setPage(pageNumber);
    fetchTodos(pageNumber);
  };


  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col text-center">
          <h2>Todo List</h2>
        </div>
      </div>
      <div className="row mb-3 align-items-center">
        <div className="col-md-6 col-sm-12 mb-2 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-6 col-sm-12 text-md-end">
          <Button onClick={openAddModal}>Add Todo</Button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered text-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date Start</th>
              <th>Finished</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id || todo._id}>
                <td>{todo.name}</td>
                <td>{todo.date_start?.slice(0, 10)}</td>
                <td className={todo.finished ? "text-success fw-bold" : ""}>{todo.finished ? "✔" : "❌"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openEditModal(todo)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteTodo(todo.id || todo._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination className="justify-content-center mt-3 mb-3">
        <Pagination.Prev onClick={() => handlePageChange(1)} disabled={page === 1}>&laquo;</Pagination.Prev>
        <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
        {[...Array(pages)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === page}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === pages} />
        <Pagination.Next onClick={() => handlePageChange(pages)} disabled={page === pages}>&raquo;</Pagination.Next>
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" fullscreen="sm-down">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Todo" : "Add Todo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control placeholder="Enter Task Name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date Start</Form.Label>
              <Form.Control
                type="date"
                value={dateStart}
                onChange={e => setDateStart(e.target.value)}
                isInvalid={!!errors.dateStart}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dateStart}
              </Form.Control.Feedback>
            </Form.Group>
            {editId && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Finished"
                  checked={finished}
                  onChange={e => setFinished(e.target.checked)}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editId ? "Save" : "Add"}</Button>
        </Modal.Footer>
      </Modal>
    </div >
  );
};

export default TodoList;

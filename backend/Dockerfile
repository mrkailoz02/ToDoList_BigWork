FROM node:20-alpine

# ติดตั้ง dependencies สำหรับคอมไพล์บางอย่าง (ถ้ามี)
#RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# เปิด port ตามที่กำหนดใน .env
EXPOSE 3000

# ใช้ npm run dev เพื่อให้ ts-node-dev ทำงานในเครื่องเรา
CMD ["npm", "run", "dev"]
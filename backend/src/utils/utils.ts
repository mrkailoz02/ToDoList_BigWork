export const encrypt = (data: string) => Buffer.from(data).toString("base64");
export const decrypt = (data: string) =>
  Buffer.from(data, "base64").toString("ascii");

export function floorTo(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.floor(value * factor) / factor;
}

export function capitalizeString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function hex2a(hexx: any) {
  var hex = hexx.toString("hex"); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export function string2Uint8Arr(str: string) {
  return Uint8Array.from(Array.from(str).map((letter) => letter.charCodeAt(0)));
}

export function concatUint8Arrays(a: Uint8Array, b: Uint8Array) {
  const newArray = new Uint8Array(a.length + b.length);
  newArray.set(a);
  newArray.set(b, a.length); // Set the second array starting at the end of the first
  return newArray;
}

export function buffer2floatArr(
  buffer: Buffer,
  length: number,
  { init = 0, size = 4 }: { init?: number; size?: number },
) {
  return [...Array(length).fill(0)].map((_, i) =>
    buffer
      .subarray(init + i * size, init + (i + 1) * size)
      .readFloatBE()
      .toFixed(2),
  );
}

export function camelToSnake<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake) as unknown as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      acc[snakeKey] = camelToSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

export function camelStringToSnake(text: string): string {
  return text.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function snakeToCamel<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel) as unknown as T;
  } else if (obj && typeof obj === "object") {
    if (obj instanceof Date) {
      return obj as any;
    }
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

import request from "supertest";
import app from "../src/app";

describe("CSV API", () => {
  it("should return 401 if not authenticated", async () => {
    const res = await request(app).post("/api/csv/upload");
    expect(res.statusCode).toBe(401);
  });
});
describe("main entry point", () => {
  it("runs without crashing", async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    await import("../src/main.tsx");
    expect(root).toBeDefined();
  });
});



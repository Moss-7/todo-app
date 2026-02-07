import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

beforeEach(() => {
  localStorage.clear();
});

describe("useLocalStorage", () => {
  test("初期値が返される", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  test("isLoadedがマウント後にtrueになる", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));
    expect(result.current[2]).toBe(true);
  });

  test("値を保存してlocalStorageに反映される", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("key")!)).toBe("updated");
  });

  test("localStorageに既存値があれば読み込まれる", () => {
    localStorage.setItem("key", JSON.stringify("existing"));

    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    expect(result.current[0]).toBe("existing");
  });

  test("関数型更新が動作する", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(JSON.parse(localStorage.getItem("count")!)).toBe(1);
  });

  test("オブジェクトの保存・読み込みが動作する", () => {
    const { result } = renderHook(() =>
      useLocalStorage("obj", { name: "test" })
    );

    act(() => {
      result.current[1]({ name: "updated" });
    });

    expect(result.current[0]).toEqual({ name: "updated" });
  });
});

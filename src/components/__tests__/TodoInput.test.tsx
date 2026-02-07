import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoInput from "../TodoInput";

describe("TodoInput", () => {
  test("入力欄とAddボタンが表示される", () => {
    render(<TodoInput onAdd={jest.fn()} />);
    expect(
      screen.getByPlaceholderText("What needs to be done?")
    ).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  test("テキスト入力してEnterで追加される", async () => {
    const onAdd = jest.fn();
    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "新しいタスク{Enter}");

    expect(onAdd).toHaveBeenCalledWith("新しいタスク");
  });

  test("Addボタンクリックで追加される", async () => {
    const onAdd = jest.fn();
    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "ボタンで追加");
    await userEvent.click(screen.getByText("Add"));

    expect(onAdd).toHaveBeenCalledWith("ボタンで追加");
  });

  test("空文字では追加されない", async () => {
    const onAdd = jest.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.click(screen.getByText("Add"));
    expect(onAdd).not.toHaveBeenCalled();
  });

  test("スペースのみでは追加されない", async () => {
    const onAdd = jest.fn();
    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "   {Enter}");

    expect(onAdd).not.toHaveBeenCalled();
  });

  test("追加後に入力がクリアされる", async () => {
    render(<TodoInput onAdd={jest.fn()} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "タスク{Enter}");

    expect(input).toHaveValue("");
  });
});

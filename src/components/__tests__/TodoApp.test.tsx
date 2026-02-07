import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoApp from "../TodoApp";

beforeEach(() => {
  localStorage.clear();
});

describe("TodoApp", () => {
  test("タイトルが表示される", () => {
    render(<TodoApp />);
    expect(screen.getByText("Todo")).toBeInTheDocument();
  });

  test("初期状態で空メッセージが表示される", () => {
    render(<TodoApp />);
    expect(screen.getByText("No tasks yet. Add one above!")).toBeInTheDocument();
  });

  test("タスクを追加できる", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "買い物に行く{Enter}");

    expect(screen.getByText("買い物に行く")).toBeInTheDocument();
    expect(
      screen.queryByText("No tasks yet. Add one above!")
    ).not.toBeInTheDocument();
  });

  test("タスク追加後にフィルターが表示される", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "タスク1{Enter}");

    expect(screen.getByText("1 item left")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  test("タスクを完了に切り替えられる", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "完了するタスク{Enter}");

    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByText("0 items left")).toBeInTheDocument();
  });

  test("タスクを削除できる", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "削除するタスク{Enter}");

    await userEvent.click(screen.getByLabelText("Delete"));

    expect(screen.queryByText("削除するタスク")).not.toBeInTheDocument();
  });

  test("Activeフィルターで未完了タスクのみ表示", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "タスクA{Enter}");
    await userEvent.type(input, "タスクB{Enter}");

    // タスクBを完了にする
    const checkboxes = screen.getAllByRole("checkbox");
    await userEvent.click(checkboxes[0]); // タスクBは先頭（新しい順）

    await userEvent.click(screen.getByText("Active"));

    expect(screen.getByText("タスクA")).toBeInTheDocument();
    expect(screen.queryByText("タスクB")).not.toBeInTheDocument();
  });

  test("Completedフィルターで完了タスクのみ表示", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "タスクA{Enter}");
    await userEvent.type(input, "タスクB{Enter}");

    const checkboxes = screen.getAllByRole("checkbox");
    await userEvent.click(checkboxes[0]); // タスクBを完了

    await userEvent.click(screen.getByText("Completed"));

    expect(screen.queryByText("タスクA")).not.toBeInTheDocument();
    expect(screen.getByText("タスクB")).toBeInTheDocument();
  });

  test("Clear completedで完了タスクが削除される", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(input, "残すタスク{Enter}");
    await userEvent.type(input, "消すタスク{Enter}");

    const checkboxes = screen.getAllByRole("checkbox");
    await userEvent.click(checkboxes[0]); // 消すタスクを完了

    await userEvent.click(screen.getByText("Clear completed"));

    expect(screen.getByText("残すタスク")).toBeInTheDocument();
    expect(screen.queryByText("消すタスク")).not.toBeInTheDocument();
  });
});

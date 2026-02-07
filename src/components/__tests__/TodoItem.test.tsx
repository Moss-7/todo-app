import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "../TodoItem";
import { Todo } from "@/types/todo";

const baseTodo: Todo = {
  id: "1",
  text: "テストタスク",
  completed: false,
  createdAt: Date.now(),
};

const defaultProps = {
  todo: baseTodo,
  onToggle: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("TodoItem", () => {
  test("タスクテキストが表示される", () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText("テストタスク")).toBeInTheDocument();
  });

  test("チェックボックスが未完了状態で表示される", () => {
    render(<TodoItem {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("完了タスクはチェック済みで表示される", () => {
    render(
      <TodoItem {...defaultProps} todo={{ ...baseTodo, completed: true }} />
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  test("完了タスクは取り消し線がつく", () => {
    render(
      <TodoItem {...defaultProps} todo={{ ...baseTodo, completed: true }} />
    );
    const text = screen.getByText("テストタスク");
    expect(text.className).toContain("line-through");
  });

  test("チェックボックスクリックでonToggleが呼ばれる", async () => {
    const onToggle = jest.fn();
    render(<TodoItem {...defaultProps} onToggle={onToggle} />);

    await userEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith("1");
  });

  test("削除ボタンクリックでonDeleteが呼ばれる", async () => {
    const onDelete = jest.fn();
    render(<TodoItem {...defaultProps} onDelete={onDelete} />);

    await userEvent.click(screen.getByLabelText("Delete"));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  test("ダブルクリックで編集モードに入る", async () => {
    render(<TodoItem {...defaultProps} />);

    await userEvent.dblClick(screen.getByText("テストタスク"));

    const input = screen.getByDisplayValue("テストタスク");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  test("編集してEnterで保存される", async () => {
    const onEdit = jest.fn();
    render(<TodoItem {...defaultProps} onEdit={onEdit} />);

    await userEvent.dblClick(screen.getByText("テストタスク"));
    const input = screen.getByDisplayValue("テストタスク");

    await userEvent.clear(input);
    await userEvent.type(input, "編集後{Enter}");

    expect(onEdit).toHaveBeenCalledWith("1", "編集後");
  });

  test("編集中にEscapeでキャンセルされる", async () => {
    const onEdit = jest.fn();
    render(<TodoItem {...defaultProps} onEdit={onEdit} />);

    await userEvent.dblClick(screen.getByText("テストタスク"));
    const input = screen.getByDisplayValue("テストタスク");

    await userEvent.clear(input);
    await userEvent.type(input, "変更中{Escape}");

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText("テストタスク")).toBeInTheDocument();
  });
});

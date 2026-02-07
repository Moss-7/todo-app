import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoFilter from "../TodoFilter";

const defaultProps = {
  filter: "all" as const,
  onFilterChange: jest.fn(),
  activeCount: 3,
  completedCount: 2,
  onClearCompleted: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("TodoFilter", () => {
  test("残りタスク数が表示される（複数形）", () => {
    render(<TodoFilter {...defaultProps} />);
    expect(screen.getByText("3 items left")).toBeInTheDocument();
  });

  test("残りタスク数が1の場合は単数形", () => {
    render(<TodoFilter {...defaultProps} activeCount={1} />);
    expect(screen.getByText("1 item left")).toBeInTheDocument();
  });

  test("3つのフィルターボタンが表示される", () => {
    render(<TodoFilter {...defaultProps} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  test("フィルターボタンクリックでonFilterChangeが呼ばれる", async () => {
    const onFilterChange = jest.fn();
    render(
      <TodoFilter {...defaultProps} onFilterChange={onFilterChange} />
    );

    await userEvent.click(screen.getByText("Active"));
    expect(onFilterChange).toHaveBeenCalledWith("active");

    await userEvent.click(screen.getByText("Completed"));
    expect(onFilterChange).toHaveBeenCalledWith("completed");
  });

  test("Clear completedボタンが表示される", () => {
    render(<TodoFilter {...defaultProps} />);
    expect(screen.getByText("Clear completed")).toBeInTheDocument();
  });

  test("Clear completedクリックでonClearCompletedが呼ばれる", async () => {
    const onClearCompleted = jest.fn();
    render(
      <TodoFilter {...defaultProps} onClearCompleted={onClearCompleted} />
    );

    await userEvent.click(screen.getByText("Clear completed"));
    expect(onClearCompleted).toHaveBeenCalled();
  });

  test("completedCount=0のときClear completedが無効", () => {
    render(<TodoFilter {...defaultProps} completedCount={0} />);
    expect(screen.getByText("Clear completed")).toBeDisabled();
  });
});

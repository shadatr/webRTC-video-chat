import classNames from "classnames";

interface ButtonProps {
    onClick?: () => void;
    className: string;
    testId?: string;
    type?: "submit" | "button" | "reset";
}
export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    testId,
    className,
    type = "submit",
}) => {
    return (
        <button
            type={type}
            data-testid={testId}
            onClick={onClick}
            className={classNames(
                " p-2 rounded-lg  text-white",
                className
            )}
        >
            {children}
        </button>
    );
};

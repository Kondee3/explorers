interface Props {
  children: string;
  onClick: () => void;
  styles?: string;
}
const FirstRowButton = ({ onClick, children, styles }: Props) => {
  return (
    <th
      className={
        "firstRowButton text-left hover:bg-gray-500  hover:cursor-pointer " +
        styles
      }
      onClick={onClick}
    >
      {children}
    </th>
  );
};
export default FirstRowButton;

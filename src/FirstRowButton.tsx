interface Props {
  children: string;
  onClick: () => void;
  styles?: string;
}
const FirstRowButton = ({ onClick, children, styles }: Props) => {
  return (
    <th
      className={"firstRowButton text-left border-b hover:backdrop-contrast-20 hover:cursor-pointer " +
        styles}
      onClick={onClick}
    >
      {children}
    </th>
  );
};
export default FirstRowButton;

interface Props {
  children: string;
  onClick: () => void;
  styles: string;
}
const FirstRowButton = ({ onClick, children, styles}: Props) => {
  return (
    <>
      <th className={"firstRowButton " + styles} onClick={onClick}>
        {children}
      </th>
    </>
  );
};
export default FirstRowButton;

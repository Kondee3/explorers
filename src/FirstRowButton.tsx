interface Props {
    children: string;
  onClick: () => void;
}
const FirstRowButton = ({ onClick, children }: Props) => {
  return (
    <>
      <th onClick={onClick}>
                {children}
      </th>
    </>
  );
};
export default FirstRowButton;

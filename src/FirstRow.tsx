import FirstRowButton from "./FirstRowButton";

interface Props {
  sortFunction: (column_name: string) => void;
}
const FirstRow = ({ sortFunction }: Props) => {
  return (
    <tr className="">
      <FirstRowButton children="Name" onClick={() => sortFunction("name")} />
      <FirstRowButton
        children="Type"
        onClick={() => sortFunction("file_type")}
      />
      <FirstRowButton children="Size" onClick={() => sortFunction("size")} />
    </tr>
  );
};
export default FirstRow;

const CardHeader = (props: any) => {
  return (
    <div>
      <div className=" font-bold">{props.mainTxt}</div>
      <div className=" text-gray-400 font-medium text-sm">
        {props.subTxt}
      </div>
    </div>
  );
};
export default CardHeader;
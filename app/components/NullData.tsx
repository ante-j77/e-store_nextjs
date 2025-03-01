interface NullDataProps {
  title: string;
}

const NullData = ({ title }: NullDataProps) => {
  return (
    <div className="w-full h-[50vh] flex items-center justify-center text-xl px-2 text-center md:text-2xl ">
      <p className="font-medium">{title}</p>
    </div>
  );
};

export default NullData;

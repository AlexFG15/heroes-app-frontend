interface Props {
  title: string;
  descriptipon?: string;
}

export const CustomJumbotron = ({ title, descriptipon }: Props) => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-red from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        {descriptipon && (
          <p className="text-gray-600 text-lg">{descriptipon}</p>
        )}
      </div>
    </div>
  );
};

import Loading from "../../assets/Loader.gif";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <img src={Loading} alt="loading..." loading="lazy" />
      {/* <p>Don't Close this Page.</p> */}
    </div>
  );
};

export default Loader;

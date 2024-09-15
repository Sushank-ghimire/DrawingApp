import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const index = () => {
  return (
    <div className="h-screen w-screen space-y-6 bg-black flex justify-center items-center flex-col">
      <h1 className="text-white text-2xl text-center flex justify-center items-center">404 | page not found</h1>
      <Link to={"/"}>
        <Button className="gap-3" variant={"outline"}>
          {" "}
          <span> Go back to homepage</span> <FaArrowRight />
        </Button>
      </Link>
    </div>
  );
};

export default index;

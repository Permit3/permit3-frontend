import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root";
import Button from "./forms/Button";
import { BackArrowIcon2 } from "../../components/icons/BackArrowIcon2";
import { setPreviousEndpoint } from "../../store/navigationSlice";
import { useRouter } from "next/router";

function BackComponent() {
  const { previousEndpoint } = useSelector((state: RootState) => state.navigation);

  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <>
      {previousEndpoint && previousEndpoint !== router.pathname ? (
        <div className="mb-4 w-full max-w-7xl mx-auto">
          <Button
            className="border-opacity-10 border-black"
            style="secondary"
            icon={<BackArrowIcon2 className="h-4 w-4" />}
            rounded={true}
            onClick={() => {
              const prev = previousEndpoint;
              dispatch(setPreviousEndpoint(undefined));
              router.push(prev);
            }}
          >
            Back
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default BackComponent;

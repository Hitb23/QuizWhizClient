import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Skip,
  Priceicon,
  CoinIcon,
  Knapsack,
  CrossMoney,
  LifeLineBG,
  SkipPY,
  FiftyPY,
  HeartPY,
} from "../../assets/index";
import withReactContent from "sweetalert2-react-content";
import classes from "./style.module.css";
import Swal from "sweetalert2";
import CoinsCard from "../../components/admin-cards/coins-card";
import { BuyLifeline } from "../../services/quizSocket.service";
import jwtDecoder from "../../services/jwtDecoder";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const BuyLifelines = ({ isOpen, closeHandler, coinsAndLifelinesDetails }) => {
  const [open, setOpen] = React.useState(false);
  const [coins, setCoins] = useState(0);
  const [lifeLines, setLifeLines] = useState(
    coinsAndLifelinesDetails?.Lifelines
  );
  const [skipLifeline, setSkipLifeline] = useState(0);
  const [anotherChanceLifeline, setAnotherChanceLifeline] = useState(0);
  const [fiftyLifeline, setFiftyLifeline] = useState(0);
  const MySwal = withReactContent(Swal);
  const NotEnoughCoinsHandler = async () => {
    await Swal.fire({
      // icon: "error",
      imageUrl: CrossMoney,
      imageHeight: "10rem",
      background: "#3d3189",
      title: "Oops...",
      color: "white",
      text: "You Don't Have Enough Amount To Purchase Lifeline!",
      confirmButtonColor: "#6F41DB",
    });
  };
  useEffect(() => {
    setOpen(isOpen ?? false);
    setCoins(coinsAndLifelinesDetails?.CoinsCount ?? 0);
    setLifeLines(coinsAndLifelinesDetails?.Lifelines);
    if (coinsAndLifelinesDetails?.UserLifelines) {
      setSkipLifeline(coinsAndLifelinesDetails?.UserLifelines[0]);
      setFiftyLifeline(coinsAndLifelinesDetails?.UserLifelines[1]);
      setAnotherChanceLifeline(coinsAndLifelinesDetails?.UserLifelines[2]);
    }
  }, [coinsAndLifelinesDetails]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    closeHandler();
  };
  const incrementHandler = async (id, count) => {
    const userdata = jwtDecoder();
    const username = userdata["Username"];
    const data = {
      UserName: username,
      LifelineId: id,
    };
    try {
      const response = await BuyLifeline(data);
      // console.log(response);
      if (id == 1) {
        setSkipLifeline({ LifelineCount: count + 1, LifelineId: id });
        setCoins((coins) => Math.max(coins - 150, 0));
      } else if (id == 2) {
        setFiftyLifeline({ LifelineCount: count + 1, LifelineId: id });
        setCoins((coins) => Math.max(coins - 100, 0));
      } else if (id == 3) {
        setAnotherChanceLifeline({ LifelineCount: count + 1, LifelineId: id });
        setCoins((coins) => Math.max(coins - 200, 0));
      }
    } catch (error) {
      if (error.response.data.isSuccess == false) NotEnoughCoinsHandler();
    }
  };

  return (
    <React.Fragment>
      {/* <button className="bg-white"  onClick={handleClickOpen}>
        Open dialog
      </button> */}
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 10,
          top: 10,
          color: "white",
          zIndex: "5",
        }}
      >
        <CloseIcon />
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        maxWidth={true}
        sx={{
          zIndex: "10",
          marginTop: "6rem",
          "& .closeButton": {
            position: "absolute",
            top: "-20px", // Adjust the value to move the button outside the dialog
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          },
        }}
        className="shadow-lg"
      >
        <DialogTitle
          sx={{ background: "#3d3189", minWidth: "5rem" }}
          id="customized-dialog-title"
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex gap-2 align-items-center ">
              <h2 className={` ${classes["Shoptext"]} text-black mt-2 `}>
                SHOP
              </h2>
              <img
                src={Knapsack}
                height={65}
                className={`${classes["knapsack-design"]} `}
              />
            </div>

            {/* <div
                className={`rounded-4 d-flex  justify-content-between align-items-center m-3 ${classes["lifeLineShadow"]}`}
                style={{ background: "#6F41DB" }}
              >
                <img src={Heart} height={28} className={`ms-2 me-3 my-2 `} />
                <small
                  className={`mx-2 fw-bold fs-5  px-2 ${classes["text-bg"]}`}
                >
                  {userlifeLines?.length ?? 0}
                </small>
              </div> */}

            <div
              className={`rounded-4 d-flex  justify-content-between align-items-center p-2 ${classes["lifeLineShadow"]}`}
              style={{ background: "#6F41DB" }}
            >
              <img src={CoinIcon} height={28} />
              <small className={`mx-1  fw-bold  ${classes["text-bg"]}`}>
                {coins}
              </small>
            </div>
          </div>
        </DialogTitle>

        <DialogContent
          sx={{ height: "33rem", width: "100%", background: "#6F41DB" }}
        >
          <div className="d-flex justify-content-center my-2 rounded-2 py-4 ">
            <img src={LifeLineBG} height={200} />
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap  gap-3 rounded-2">
            <CoinsCard
              imageUrl={SkipPY}
              value={lifeLines[0].Value}
              priceIcon={Priceicon}
              totalLifeline={skipLifeline}
              incrementCount={incrementHandler}
            />
            <CoinsCard
              imageUrl={HeartPY}
              value={lifeLines[2].Value}
              priceIcon={Priceicon}
              totalLifeline={anotherChanceLifeline}
              incrementCount={incrementHandler}
            />
            <CoinsCard
              imageUrl={FiftyPY}
              value={lifeLines[1].Value}
              priceIcon={Priceicon}
              totalLifeline={fiftyLifeline}
              incrementCount={incrementHandler}
            />
          </div>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default BuyLifelines;

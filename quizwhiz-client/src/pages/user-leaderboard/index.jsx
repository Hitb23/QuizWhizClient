import React from "react";
import tempImage from "../../assets/bg-image.svg";
import classes from "./style.module.css"
const UserLeaderBoard = () => {
  return (
    <>
     <div className={`${classes['full-screen']}`}>
      <div className="container shadow p-2 bg-gradient">
        <h1 className="text-center">User Leaderboard</h1>
        <div className="row">
          <div className="col-md-4">
            <img src={tempImage} className="img-fluid" />
          </div>
          <div className="col-md-8">
            <div>
            </div>
            <div className="table-responsive">
              <table className={`table ${classes['LeaderBoard-table']}`}>
                <thead>
                  <tr>
                    <th className={` ${classes['bg-transparent']}`}>Rank</th>
                    <th className={` ${classes['bg-transparent']}`}>UserName</th>
                    <th className={` ${classes['bg-transparent']}`}>Total Marks</th>
                    <th className={` ${classes['bg-transparent']}`}>Winning Ammount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr >
                    <th className={` ${classes['bg-transparent']}`}>1</th>
                    <td className={` ${classes['bg-transparent']}`}>Mark</td>
                    <td className={` ${classes['bg-transparent']}`}>Otto</td>
                    <td className={` ${classes['bg-transparent']}`}>@mdo</td>
                  </tr>
                  <tr >
                    <th className={` ${classes['bg-transparent']}`}>1</th>
                    <td className={` ${classes['bg-transparent']}`}>Mark</td>
                    <td className={` ${classes['bg-transparent']}`}>Otto</td>
                    <td className={` ${classes['bg-transparent']}`}>@mdo</td>
                  </tr>
                  <tr >
                    <th className={` ${classes['bg-transparent']}`}>1</th>
                    <td className={` ${classes['bg-transparent']}`}>Mark</td>
                    <td className={` ${classes['bg-transparent']}`}>Otto</td>
                    <td className={` ${classes['bg-transparent']}`}>@mdo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default UserLeaderBoard;

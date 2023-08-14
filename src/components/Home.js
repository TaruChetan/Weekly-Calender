import React, { useEffect, useState } from "react";
import jsonData from "../utils/data.json";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Select } from "antd";
import "./Home.css";
import dayjs from "dayjs";
import {
  AM,
  NEXT_WEEK,
  PAST,
  PM,
  PREVIOUS_WEEK,
  UTC0,
  UTC0_VAL,
  UTC5,
  UTC5_VAL,
} from "../utils/constants";
const Home = () => {
  const [currentWeek, setcurrentWeek] = useState([]);
  const [selectTimezone, setSelectTimezone] = useState("UTC-5");
  useEffect(() => {
    const weeks = handleWeekChange(dayjs());
    setcurrentWeek(weeks);
  }, []);
  const date = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const timezones = [
    {
      label: UTC5,
      value: UTC5_VAL,
    },
    {
      label: UTC0,
      value: UTC0_VAL,
    },
  ];
  const formattedDate = `${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;
  const handleChange = (value) => {
    setSelectTimezone(value);
  };
  const currentDatecheck = (item) => {
    const dt1 = dayjs().format("DD-MM-YYYY");
    const dt2 = dayjs(item).format("DD-MM-YYYY");
    let splitD1 = dt1.split("-");
    let splitD2 = dt2.split("-");
    if (
      splitD1.length === 3 &&
      splitD2.length === 3 &&
      splitD1[0] == splitD2[0] &&
      splitD1[1] == splitD2[1] &&
      splitD1[2] == splitD2[2]
    ) {
      return true;
    } else {
      return false;
    }
  };
  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const amPm = hour >= 12 ? PM : AM;
        const displayHour = hour > 12 ? hour - 12 : hour;
        const formattedTime = `${displayHour === 0 ? 12 : displayHour}:${
          minute === 0 ? "00" : minute
        } ${amPm}`;
        if (formattedTime != "11:30 PM") timeSlots.push(formattedTime);
      }
    }
    return timeSlots;
  };
  const displayChecks = (item) => {
    const findDate = jsonData.filter((el) => dayjs(el.Date).isSame(item));
    let findTime = [];
    if (findDate.length) {
      findDate.forEach((item) => {
        const splitTime = item.Time.split(":");

        if (splitTime.length > 1) {
          const hour = splitTime[0] > 12 ? splitTime[0] - 12 : splitTime[0];

          const amPm = splitTime[0] >= 12 ? PM : AM;

          findTime.push(`${hour}:${splitTime[1]} ${amPm}`);
        }
      });
    }
    return (
      <>
        {generateTimeSlots().map((item) => {
          return (
            <Checkbox
              checked={
                findTime.length && findDate.length
                  ? findTime.includes(item)
                    ? true
                    : false
                  : false
              }
              style={{ width: "7%" }}
            >
              {item}
            </Checkbox>
          );
        })}
      </>
    );
  };

  const handleWeekChange = (date) => {
    if (date) {
      const selectedDate = date.toDate();
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - startDate.getDay());

      const weekDates = [];
      for (let i = 1; i < 6; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        weekDates.push(currentDate.toDateString());
      }

      return weekDates;
    }
  };
  const handleNextWeek = () => {
    const currentday = dayjs(currentWeek[currentWeek.length - 1]);
    const next = currentday.add(2, "day");
    const nextWeek = handleWeekChange(next);
    setcurrentWeek(nextWeek);
  };
  const handlePreviousWeek = () => {
    const currentday = dayjs(currentWeek[0]);

    const prev = currentday.subtract(2, "day");
    const nextWeek = handleWeekChange(prev);
    setcurrentWeek(nextWeek);
  };

  return (
    <>
      <div className="main">
        <div className="navigation-buttons">
          <div>
            <Button onClick={handlePreviousWeek} type="link" block>
              <CaretLeftOutlined />
              {PREVIOUS_WEEK}
            </Button>
          </div>
          <div>{formattedDate}</div>
          <div>
            <Button onClick={handleNextWeek} type="link" block>
              {NEXT_WEEK}
              <CaretRightOutlined />
            </Button>
          </div>
        </div>
        <div className="timezone">
          <div style={{ padding: 10 }}>
            <Select
              defaultValue={timezones[0].label}
              style={{
                width: "100%",
              }}
              onChange={handleChange}
              options={timezones}
            />
          </div>
        </div>
        <div className="content">
          {currentWeek?.map((item) => {
            return (
              <>
                <div style={{ width: "100%", height: "auto", display: "flex" }}>
                  <div style={{ width: "5%" }}>{item}</div>
                  <div style={{ width: "95%" }}>
                    {dayjs() < dayjs(item) || currentDatecheck(item) ? (
                      displayChecks(item)
                    ) : (
                      <span>{PAST}</span>
                    )}
                  </div>
                </div>
                <Divider />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;

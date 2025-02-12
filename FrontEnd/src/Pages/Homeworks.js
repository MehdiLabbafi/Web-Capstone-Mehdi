import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Toastify_Error } from '../Components/Toastify';
import Vertical from '../Components/Vertical';
import Horizontal from '../Components/Horizontal';

import deleteAllCookies from '../Functions/deleteCookies';
import Footer from '../Components/Footer';

import BaseURL from "../BaseURL"
import BaseName from "../BaseName"

import Homework from '../Components/Homework';


// Functions
import infToField from '../Functions/intToField';
import intToGrade from '../Functions/intToGrade';
import fieldToInt from '../Functions/fieldToInt';
import gradeToInt from '../Functions/gradeToInt';
import Auth from '../Functions/Auth';
import getExtraInfos from '../Functions/getExtraInfos';

const Homeworks = () => {


    const cookies = new Cookies();
    const navigate = new useNavigate();

    const [id, setid] = useState();
    const [avatar, setavatar] = useState();
    const [name, setName] = useState();
    const [family, setfamily] = useState();
    const [time, settime] = useState();
    const [activity, setActivity] = useState();


    // Extra Infos
    const [grade, setgrade] = useState();
    const [userClass, setUserClass] = useState();
    const [groups, setgroups] = useState();
    const [field, setfield] = useState();
    const [mustStudy, setmustStudy] = useState();



    const [homeworkData, sethomeworkData] = useState([]);
    useEffect(() => {
        document.title = BaseName + "Homeworks";
        (async () => {
            if (cookies.get("id") && cookies.get("username") && cookies.get("password")) {
                const result = await Auth(cookies.get("id"), cookies.get("username"), cookies.get("password"))
                if (result) {
                    setid(result.id);
                    setavatar(`../Images/avatars/${result.avatar}`);
                    setName(result.name);
                    setfamily(result.family);
                    settime(result.time);
                    setActivity(result.activity);
                } else {
                    Toastify_Error("Please log in to your account");
                    deleteAllCookies();
                    navigate("/Login")
                }
                const result_extra = await getExtraInfos(cookies.get("id"));
                if (result_extra) {
                    // Must Study
                    setmustStudy(result_extra.must_study);
                    // "Grade"
                    setgrade((result_extra.grade));
                    // Class
                    if (result_extra.class != "0") {
                        setUserClass(result_extra.class);
                    } else {
                        setUserClass("Invalid");
                    }
                    // Groups
                    if (result_extra.groups != "0") {
                        setgroups(result_extra.groups);
                    } else {
                        setgroups("Invalid");
                    }
                    // field
                    setfield((result_extra.field));

                } else {
                    setgrade("Invalid");
                    setUserClass("Invalid");
                    setgroups("Invalid");
                    setfield("Invalid");
                }
            } else {
                Toastify_Error("Please log in to your account");
                deleteAllCookies();
                navigate("/Login")
            }
        })()
    }, []);


    useEffect(() => {
        if (id && userClass && field && grade) {
            sethomeworkData([]);
            axios.post(BaseURL + "cms-backend/homework.php", {
                class: userClass,
                field: fieldToInt(field),
                grade: gradeToInt(grade),
            })
                .then(function (response) {
                    if (response.data.resp == "200") {
                        for (let i = 0; i < Object.keys(response.data).length - 1; i++) {
                            sethomeworkData(homeworkData => [...homeworkData, [response.data[i].title, response.data[i].lesson, response.data[i].description, response.data[i].extra_file, response.data[i].time, response.data[i].homework_id]])
                        }
                    }
                })
                .catch(function (error) {
                    sethomeworkData([]);
                })
        }
    }, [grade, userClass, field, id]);

    return (
        <>
            <div className='flex w-full h-full'>
                <Horizontal name={name} family={family} activity={activity} />
                <Vertical name={name} family={family} activity={activity} activeTab={3} />
                <div className='width-set h-full absolute left-0  py-2 pt-28 sm:pt-28 2xl:pt-9 sm:py-9 px-2 sm:px-8 font-Shabnam' >
                    <div className='w-full mb-9 h-hfull bg-bg_light-100 dark:bg-bg_dark-50 rounded-xl overflow-y-auto ' dir='rtl'>
                        <h3 className='text-gray-400   font-Shabnam_Bold text-xl p-6'>Homework List (Online)</h3>
                        <div className='mt-5'>
                            {
                                homeworkData.length > 0 &&
                                <Homework >{homeworkData}</Homework>
                            }
                        </div>
                    </div>
                </div>

            </div >
            <Footer />
        </>
    );
};

export default Homeworks;
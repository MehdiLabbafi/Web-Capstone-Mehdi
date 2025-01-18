import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Toastify_Error, Toastify_Info, Toastify_Success } from '../Components/Toastify';
import Vertical from '../Components/Vertical';
import Horizontal from '../Components/Horizontal';

import deleteAllCookies from '../Functions/deleteCookies';
import Footer from '../Components/Footer';

import BaseURL from "../BaseURL"
import BaseName from "../BaseName"




// Functions
import infToField from '../Functions/intToField';
import intToGrade from '../Functions/intToGrade';
import fieldToInt from '../Functions/fieldToInt';
import gradeToInt from '../Functions/gradeToInt';
import Auth from '../Functions/Auth';
import getExtraInfos from '../Functions/getExtraInfos';

const Setting = () => {

    const cookies = new Cookies();
    const navigate = new useNavigate();

    const [id, setid] = useState();
    const [avatar, setavatar] = useState();
    const [name, setName] = useState();
    const [family, setfamily] = useState();
    const [time, settime] = useState();
    const [activity, setActivity] = useState();
    const [mobile, setMobile] = useState();


    // Extra Infos
    const [grade, setgrade] = useState();
    const [userClass, setUserClass] = useState();
    const [groups, setgroups] = useState();
    const [field, setfield] = useState();
    const [mustStudy, setmustStudy] = useState();
    const [changeable, setChangeable] = useState(1);

    useEffect(() => {
        document.title = BaseName + "Settings";
        (async () => {
            if (cookies.get("id") && cookies.get("username") && cookies.get("password")) {
                const result = await Auth(cookies.get("id"), cookies.get("username"), cookies.get("password"))
                if (result) {
                    setid(result.id);
                    setavatar(result.customAvatar);
                    setName(result.name);
                    setfamily(result.family);
                    settime(result.time);
                    setActivity(result.activity);
                    setMobile(result.mobile)

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

    const setData = () => {
        axios.post(BaseURL + "cms-backend/setData.php", {
            id: id,
            name: name,
            family: family,
            mobile: mobile,
            must_study: mustStudy,
            activity: activity,
            grade: gradeToInt(grade),
            field: fieldToInt(field),
            class: userClass,
            groups: groups,
        })
            .then(function (response) {
                if (response.data == "200") {
                    Toastify_Success("Information saved successfully")
                } else {
                    Toastify_Error("An error occurred while saving the information ")
                }
            })
            .catch(function () {
                Toastify_Error("An error occurred while saving the information ")

            })
    }
    const [selectedImage, setSelectedImage] = useState();


    const onFileChange = (e) => {
        let files = e.target.files;
        let fileReader = new FileReader();
        if (files.length > 0) {
            fileReader.readAsDataURL(files[0]);

            fileReader.onload = (event) => {
                setSelectedImage(event.target.result)
            }
        }
    }
    const onSubmit = () => {
        const formData = { id: id, image: selectedImage }
        let endpoint = BaseURL + "cms-backend/avatars.php";
        axios.post(endpoint, formData, {
        }).then((resp) => {
            if (resp.data[0] == "200") {
                Toastify_Info("Please refresh the website");
                cookies.set("avatar", resp.data[1]);
            } else {
                cookies.set("avatar", "defult.png");
            }
        }).catch(() => {
            cookies.set("avatar", "defult.png");
        })
    }

    return (
        <>
            <div className='flex w-full h-full'>
                <Horizontal name={name} family={family} activity={activity} />
                <Vertical name={name} family={family} activity={activity} activeTab={6} />
                <div className='width-set h-full absolute left-0 py-2 pt-28 sm:pt-28 2xl:pt-9 sm:py-9 px-2 sm:px-8 font-Shabnam' >
                    <div className='w-full mb-9 h-hfull  bg-bg_light-100 dark:bg-bg_dark-50 rounded-xl overflow-y-auto  pb-9 ' dir='rtl'>
                        <h3 className='text-gray-400 font-Shabnam_Bold text-xl p-6'>Settings</h3>
                        {
                            !changeable && <p className='mr-12 text-red-700 text-sm font-Shabnam_Bold'> <i className="fa-solid fa-circle-exclamation text-lg ml-3"></i> This section is not disabled for you! </p>
                        }
                        <div className={' select-none  ' + (!changeable && "opacity-40 pointer-events-none")}>
                            <div className='flex p-12 '>
                                <img className=' w-24 h-24 rounded-md mx-3' src={avatar ? require(`../Images/avatars/${avatar}`) : require(`../Images/avatars/defult.png`)} alt="avatar" />
                                <div className='mx-3 mt-1'>
                                    <p className='capitalize text-bg_dark-200 dark:text-texts mb-5 text-lg'>{name}&nbsp;{family}</p>
                                    <input className=' absolute -mr-36 p-8 z -mt-10 opacity-0' type="file" onChange={onFileChange} />
                                    <button onClick={onSubmit} className='relative z-10 ml-2 text-texts border-transparent border bg-btns w-24 py-1.5 rounded-lg hover:shadow-lg hover:shadow-actives transition-all' type='button'>Update</button>
                                </div>
                            </div>
                            <form className='block sm:flex justify-between w-full pt-5 px-6 font-Shabnam'>
                                <div className='w-full sm:w-1/2  mx-0 sm:mx-8'>
                                    <div className="relative z-0 mb-16 group w-full">
                                        <input onChange={(event) => {
                                            setName(event.target.value)
                                        }} value={name ? name : ""} type="text" name="name" className=" input-set block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " autoComplete='off' />
                                        <label htmlFor="name" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-9 scale-80 top-3 -z-10 origin-[0] peer-focus:right-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-9">Name</label>
                                    </div>
                                    <div className="mt-9 sm:mt-20 relative z-0 mb-16 group w-full">
                                        <input onChange={(event) => {
                                            setMobile(event.target.value)
                                        }} value={mobile ? mobile : ""} type="tel" name="tel" className=" input-set block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " autoComplete='off' />
                                        <label htmlFor="tel" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-9 scale-80 top-3 -z-10 origin-[0] peer-focus:right-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-9">Mobile Phone</label>
                                    </div>
                                </div>

                                <div className='w-full sm:w-1/2  mx-0 sm:mx-8'>
                                    <div className=" relative z-0 w-full group mb-16">
                                        <input onChange={(event) => {
                                            setfamily(event.target.value)
                                        }} value={family ? family : ""} type="text" name="family" id="family" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " autoComplete='off' />
                                        <label htmlFor="family" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-9 scale-80 top-3 -z-10 origin-[0] peer-focus:right-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-9">Last Name</label>
                                    </div>
                                    <div className="mt-9 sm:mt-20 relative z-0 mb-16 group w-full">
                                        <input onChange={(event) => {
                                            setmustStudy(event.target.value)
                                        }} value={mustStudy ? mustStudy : ""} type="number" name="must_study" className=" input-set block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " autoComplete='off' />
                                        <label htmlFor="must_study" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-9 scale-80 top-3 -z-10 origin-[0] peer-focus:right-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-9  ">Study Amount</label>
                                    </div>
                                </div>
                            </form>

                            <div className='px-12'>
                                <div className='mt-12 tbl-width border border-gray-700 rounded-lg'>
                                    <div className='m-6 text-bg_dark-200 dark:text-gray-300 text-lg flex'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        User account settings
                                    </div>
                                    <div className=" bg-opacity-80 ">
                                        <table className=" w-full  text-bg_dark-200 dark:text-gray-300 ">
                                            <tbody>
                                                <tr className='border-b border-t  border-b-gray-700 border-t-gray-700'>
                                                    <th className='w-1/5 text-right p-5 pb-8 pr-12 font-Shabnam_Bold'>Status</th>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="active" className='dark:text-green-300 text-green-500'>
                                                            <input onChange={() => { setActivity(1) }} checked={activity == 1 ? true : false} type="radio" id='active' name="status" className="radio radio-primary mx-4 w-5 h-5 " />
                                                            Active</label>
                                                    </td>
                                                    <td className='w-1/5 text-right' >
                                                        <label htmlFor="ide" className='dark:text-yellow-300 text-yellow-500'>
                                                            <input onChange={() => { setActivity(2) }} checked={activity == 2 ? true : false} type="radio" id='ide' name="status" className="radio radio-secondary mx-4 w-5 h-5 " />
                                                            Rest</label>
                                                    </td>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="dnd" className='dark:text-red-400 text-red-600'>
                                                            <input onChange={() => { setActivity(3) }} checked={activity == 3 ? true : false} type="radio" id='dnd' name="status" className=" radio radio-accent mx-4 w-5 h-5 " />
                                                            Do Not Disturb</label>
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-t border-b-gray-700 border-t-gray-700'>
                                                    <th className='w-1/5 text-right p-5 pb-8 pr-12 font-Shabnam_Bold'>Grade</th>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="no09">
                                                            <input onChange={() => { setgrade("Ninth") }} checked={gradeToInt(grade) == 9 ? true : false} type="radio" id='no09' name="grade" className="border border-gray-800 dark:border-gray-600 radio mx-4 w-5 h-5 " />
                                                            Ninth</label>
                                                    </td>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="no10">
                                                            <input onChange={() => { setgrade("Tenth") }} checked={gradeToInt(grade) == 10 ? true : false} type="radio" id='no10' name="grade" className="border border-gray-800 dark:border-gray-600 radio mx-4 w-5 h-5 " />
                                                            Tenth</label>
                                                    </td>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="no11">
                                                            <input onChange={() => setgrade("Eleventh")} checked={gradeToInt(grade) == 11 ? true : false} type="radio" id='no11' name="grade" className=" border border-gray-800 dark:border-gray-600  radio mx-4 w-5 h-5 " />
                                                            Eleventh</label>
                                                    </td>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="no12">
                                                            <input onChange={() => setgrade('Twelfth')} checked={gradeToInt(grade) == 12 ? true : false} type="radio" id='no12' name="grade" className=" border border-gray-800 dark:border-gray-600  radio mx-4 w-5 h-5 " />
                                                            Twelfth</label>
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-t border-b-gray-700 border-t-gray-700'>
                                                    <th className='w-1/5 text-right p-5 pb-8 pr-12 font-Shabnam_Bold'>Field</th>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="fl01">
                                                            <input onChange={() => setfield("Mathematics")} checked={fieldToInt(field) == 1 ? true : false} type="radio" id='fl01' name="field" className=" border border-gray-800 dark:border-gray-600  radio mx-4 w-5 h-5 " />
                                                            Mathematics</label>
                                                    </td>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="fl02">
                                                            <input onChange={() => setfield("Experimental")} checked={fieldToInt(field) == 2 ? true : false} type="radio" id='fl02' name="field" className=" border border-gray-800 dark:border-gray-600  radio mx-4 w-5 h-5 " />
                                                            Experimental</label>
                                                    </td>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="fl03">
                                                            <input onChange={() => setfield("Humanities")} checked={fieldToInt(field) == 3 ? true : false} type="radio" id='fl03' name="field" className="border border-gray-800 dark:border-gray-600 radio mx-4 w-5 h-5 " />
                                                            Humanities</label>
                                                    </td>
                                                    <td className='w-1/5 text-right'>
                                                        <label htmlFor="fl04">
                                                            <input onChange={() => setfield("Art")} checked={fieldToInt(field) == 4 ? true : false} type="radio" id='fl04' name="field" className=" border border-gray-800 dark:border-gray-600  radio mx-4 w-5 h-5 " />
                                                            Art</label>
                                                    </td>
                                                </tr>
                                                {
                                                    gradeToInt(grade) &&
                                                    <tr className='border-b border-t border-b-gray-700 border-t-gray-700'>
                                                        <th className='w-1/5 text-right p-5 pb-8 pr-12 font-Shabnam_Bold'>Class</th>
                                                        <td className='w-1/5 text-right'>
                                                            <label htmlFor="cl01">
                                                                <input onChange={() => gradeToInt(grade) == 9 ? setUserClass(91) : gradeToInt(grade) == 10 ? setUserClass(101) : gradeToInt(grade) == 11 ? setUserClass(111) : gradeToInt(grade) == 12 ? setUserClass(121) : setUserClass(0)} checked={userClass == "91" || userClass == "101" || userClass == "111" || userClass == "121" ? true : false} type="radio" id='cl01' name="class" className=" border border-gray-800 dark:border-gray-600  radio mx-4 w-5 h-5 " />
                                                                {gradeToInt(grade) == 9 ? "91" : gradeToInt(grade) == 10 ? "101" : gradeToInt(grade) == 11 ? "111" : gradeToInt(grade) == 12 ? '121' : "Invalid"}</label>

                                                        </td>
                                                        <td className='w-1/5 text-right'>
                                                            <label htmlFor="cl02">
                                                                <input onChange={() => gradeToInt(grade) == 9 ? setUserClass(92) : gradeToInt(grade) == 10 ? setUserClass(102) : gradeToInt(grade) == 11 ? setUserClass(112) : gradeToInt(grade) == 12 ? setUserClass(122) : setUserClass(0)} checked={userClass == "92" || userClass == "102" || userClass == "112" || userClass == "122" ? true : false} type="radio" id='cl02' name="class" className=" border border-gray-800 dark:border-gray-600  radio mx-4 w-5 h-5 " />
                                                                {gradeToInt(grade) == 9 ? "92" : gradeToInt(grade) == 10 ? "102" : gradeToInt(grade) == 11 ? "112" : gradeToInt(grade) == 12 ? '122' : "Invalid"}</label>

                                                        </td>
                                                        <td className='w-1/5 text-right'>
                                                            <label htmlFor="cl03">
                                                                <input onChange={() => gradeToInt(grade) == 9 ? setUserClass(93) : gradeToInt(grade) == 10 ? setUserClass(103) : gradeToInt(grade) == 11 ? setUserClass(113) : gradeToInt(grade) == 12 ? setUserClass(123) : setUserClass(0)} checked={userClass == "93" || userClass == "103" || userClass == "113" || userClass == "123" ? true : false} type="radio" id='cl03' name="class" className=" border border-gray-800 dark:border-gray-600  radio mx-4 w-5 h-5 " />
                                                                {gradeToInt(grade) == 9 ? "93" : gradeToInt(grade) == 10 ? "103" : gradeToInt(grade) == 11 ? "113" : gradeToInt(grade) == 12 ? '123' : "Invalid"}</label>
                                                        </td>
                                                        <td className='w-1/5 text-right'>
                                                            <label htmlFor="cl04">
                                                                <input onChange={() => gradeToInt(grade) == 9 ? setUserClass(94) : gradeToInt(grade) == 10 ? setUserClass(104) : gradeToInt(grade) == 11 ? setUserClass(114) : gradeToInt(grade) == 12 ? setUserClass(124) : setUserClass(0)} checked={userClass == "94" || userClass == "104" || userClass == "114" || userClass == "124" ? true : false} type="radio" id='cl04' name="class" className=" border border-gray-800 dark:border-gray-600  radio mx-4 w-5 h-5 " />
                                                                {gradeToInt(grade) == 9 ? "94" : gradeToInt(grade) == 10 ? "104" : gradeToInt(grade) == 11 ? "114" : gradeToInt(grade) == 12 ? '124' : "Invalid"}</label>

                                                        </td>
                                                    </tr>
                                                }
                                                {
                                                    field &&
                                                    <tr className=' border-t border-b-gray-700 border-t-gray-700'>
                                                        <th className='w-1/5 text-right p-5 pb-8 pr-12 font-Shabnam_Bold '>Group</th>
                                                        <td className='w-1/5 text-right'>
                                                            <label htmlFor="gr01">
                                                                {
                                                                    groups.trim() == "Olympiad Mathematics ".trim() || groups.trim() == "Olympiad Biology".trim() || groups.trim() == "Olympiad Economics".trim() || groups.trim() == "Olympiad Art ".trim() ?
                                                                        <input onChange={() => fieldToInt(field) == 1 ? setgroups("Olympiad Mathematics") : fieldToInt(field) == 2 ? setgroups("Olympiad Biology") : fieldToInt(field) == 3 ? setgroups("Olympiad Economics") : fieldToInt(field) == 4 ? setgroups("Olympiad Art ") : '0'} checked type="radio" id='gr01' name="group" className=" border border-gray-800 dark:border-gray-600  pointer-events-none radio mx-4 w-5 h-5 " />
                                                                        :
                                                                        <input onChange={() => fieldToInt(field) == 1 ? setgroups("Olympiad Mathematics") : fieldToInt(field) == 2 ? setgroups("Olympiad Biology") : fieldToInt(field) == 3 ? setgroups("Olympiad Economics") : fieldToInt(field) == 4 ? setgroups("Olympiad Art ") : '0'} type="radio" id='gr01' name="group" className=" border border-gray-800 dark:border-gray-600  pointer-events-none radio mx-4 w-5 h-5 " />
                                                                }
                                                                {fieldToInt(field) == 1 ? "Olympiad Mathematics" : fieldToInt(field) == 2 ? "Olympiad Biology" : fieldToInt(field) == 3 ? "Olympiad Economics" : fieldToInt(field) == 4 ? "Olympiad Art" : "Invalid"}</label>
                                                        </td>
                                                        <td className='w-1/5 text-right'>
                                                            <label htmlFor="gr02">
                                                                {
                                                                    groups.trim() == "Olympiad Computer".trim() || groups.trim() == "Olympiad Stem Cells".trim() || groups.trim() == "Olympiad Media Literacy".trim() || groups.trim() == "Olympiad Religious Studies".trim() ?
                                                                        <input onChange={() => fieldToInt(field) == 1 ? setgroups("Olympiad Computer") : fieldToInt(field) == 2 ? setgroups("Olympiad Stem Cells") : fieldToInt(field) == 3 ? setgroups("Olympiad Media Literacy") : fieldToInt(field) == 4 ? setgroups("Olympiad Religious Studies") : '0'} checked type="radio" id='gr02' name="group" className=" border border-gray-800 dark:border-gray-600  pointer-events-none radio mx-4 w-5 h-5 " />
                                                                        :
                                                                        <input onChange={() => fieldToInt(field) == 1 ? setgroups("Olympiad Computer") : fieldToInt(field) == 2 ? setgroups("Olympiad Stem Cells") : fieldToInt(field) == 3 ? setgroups("Olympiad Media Literacy") : fieldToInt(field) == 4 ? setgroups("Olympiad Religious Studies") : '0'} type="radio" id='gr02' name="group" className=" border border-gray-800 dark:border-gray-600  pointer-events-none radio mx-4 w-5 h-5 " />
                                                                }
                                                                {fieldToInt(field) == 1 ? "Olympiad Computer" : fieldToInt(field) == 2 ? "Olympiad Stem Cells" : fieldToInt(field) == 3 ? "Olympiad Media Literacy" : fieldToInt(field) == 4 ? "Olympiad Religious Studies" : "Invalid"}</label>
                                                        </td>
                                                        <td className='w-1/5 text-right'>
                                                            <label htmlFor="gr03">
                                                                {
                                                                    groups.trim() == "Olympiad Chemistry".trim() || groups.trim() == "Olympiad Chemistry".trim() || groups.trim() == "Olympiad Entrepreneurship".trim() || groups.trim() == "Olympiad Foreign Language".trim() ?
                                                                        <input onChange={() => fieldToInt(field) == 1 ? setgroups("Olympiad Chemistry") : fieldToInt(field) == 2 ? setgroups("Olympiad Chemistry") : fieldToInt(field) == 3 ? setgroups("Olympiad Entrepreneurship") : fieldToInt(field) == 4 ? setgroups("Olympiad Foreign Language") : '0'} checked type="radio" id='gr03' name="group" className=" border border-gray-800 dark:border-gray-600  pointer-events-none radio mx-4 w-5 h-5 " />
                                                                        :
                                                                        <input onChange={() => fieldToInt(field) == 1 ? setgroups("Olympiad Chemistry") : fieldToInt(field) == 2 ? setgroups("Olympiad Chemistry") : fieldToInt(field) == 3 ? setgroups("Olympiad Entrepreneurship") : fieldToInt(field) == 4 ? setgroups("Olympiad Foreign Language") : '0'} type="radio" id='gr03' name="group" className=" border border-gray-800 dark:border-gray-600  pointer-events-none radio mx-4 w-5 h-5 " />
                                                                }
                                                                {fieldToInt(field) == 1 ? "Olympiad Chemistry" : fieldToInt(field) == 2 ? "Olympiad Chemistry" : fieldToInt(field) == 3 ? "Olympiad Entrepreneurship" : fieldToInt(field) == 4 ? "Olympiad Foreign Language" : "Invalid"}</label>
                                                        </td>
                                                        <td className='w-1/5 text-right '>
                                                            <label htmlFor="gr04">
                                                                {
                                                                    groups.trim() == "Olympiad Physics".trim() || groups.trim() == "Olympiad Physics".trim() || groups.trim() == "Olympiad Literary".trim() || groups.trim() == "Olympiad Cultural".trim() ?
                                                                        <input onChange={() => fieldToInt(field) == 1 ? setgroups("Olympiad Physics") : fieldToInt(field) == 2 ? setgroups("Olympiad Physics") : fieldToInt(field) == 3 ? setgroups("Olympiad Literary") : fieldToInt(field) == 4 ? setgroups("Olympiad Cultural") : '0'} checked type="radio" id='gr04' name="group" className=" border border-gray-800 dark:border-gray-600  pointer-events-none radio mx-4 w-5 h-5 " />
                                                                        :
                                                                        <input onChange={() => fieldToInt(field) == 1 ? setgroups("Olympiad Physics") : fieldToInt(field) == 2 ? setgroups("Olympiad Physics") : fieldToInt(field) == 3 ? setgroups("Olympiad Literary") : fieldToInt(field) == 4 ? setgroups("Olympiad Cultural") : '0'} type="radio" id='gr04' name="group" className=" border border-gray-800 dark:border-gray-600  pointer-events-none radio mx-4 w-5 h-5 " />
                                                                }
                                                                {fieldToInt(field) == 1 ? "Olympiad Physics" : fieldToInt(field) == 2 ? "Olympiad Physics" : fieldToInt(field) == 3 ? "Olympiad Literary" : fieldToInt(field) == 4 ? "Olympiad Cultural" : "Invalid"}</label>

                                                        </td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <button onClick={setData} type='button' className='mt-9 mx-12 bg-btns text-texts py-2 px-9 rounded-lg hover:shadow-lg hover:shadow-actives transition-all'>Save Information</button>
                        </div>
                    </div>
                </div>

            </div >
            <Footer />
        </>
    );
}
export default Setting;

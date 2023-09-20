import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Layout Component
import AdminNavbar from "@/components/admin/Navbars/AdminNavbar.js";
import Sidebar from "@/components/admin/Sidebar/Sidebar.js";
import HeaderStats from "@/components/admin/Headers/HeaderStats.js";
import FooterAdmin from "@/components/admin/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";

import { connect } from "react-redux";
import { setUser } from "@/redux/actions/setUserAction";

const AdminWrapper = (props) => {
    // const [user, setUser] = useState([]);

    const [error, setError] = useState('');

    const router = useRouter();

    useEffect(() => {

        (
            async () => {
                try {
                    const { data } = await axios.get('user');

                    props.setUser({
                        id: data.id,
                        username: data.username,
                        email: data.email,
                        role: data.role
                    });


                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        setError('An error occurred');
                        router.push('/login');
                    }

                    if (error.response && error.response.status === 403) {
                        setError('An error occurred');
                        router.push('/login');
                    }
                }
            }
        )();


    }, []);

    return (
        <Layout>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100">
                <AdminNavbar />
                {/* Header */}
                <HeaderStats />
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    <div className="flex flex-wrap">
                        <div className="w-full mb-12 xl:mb-0 px-4">
                            {props.children}
                        </div>
                    </div>
                    <FooterAdmin />
                </div>
            </div>
        </Layout>
    )
}

// * https://www.phind.com/search?cache=yh923hlxiaeeipq2fv0952d1
const mapStateToProps = (state) => {
    return {
      user: state.user.user
    }
  }  


const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => dispatch(setUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminWrapper);

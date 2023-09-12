import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// components

import CardSettings from "@/components/admin/Cards/CardSettings.js";
import CardProfile from "@/components/admin/Cards/CardProfile.js";

// layout for page

import AdminWrapper from "@/components/admin/AdminWrapper";

export default function Settings() {
  // Getting the user data
  const [user, setUser] = useState('');

  const [error, setError] = useState('');

  const router = useRouter();
  useEffect(() => {

    (
      async () => {
        try {
          const { data } = await axios.get('user');
          setUser(data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            setError('Authentication Error');

            // Set up a timer to redirect after 5 seconds
            setTimeout(() => {
              router.push('login');
            }, 5000); // 5000 milliseconds = 5 seconds

          } else {
            setError('An error occurred');
            console.log(error);
          }
        }
      }
    )();


  }, [])
  return (
    <AdminWrapper>
      <CardSettings />
    </AdminWrapper>
  );
}


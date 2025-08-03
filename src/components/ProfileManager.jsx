import { useUserList } from '../customhook/fetchData/useUsers'
import React from 'react'

function ProfileManager() {

  const { data, loading } = useUserList()

  return (
    loading ? (
      <>

      </>
    ) : (
      <>
        <div className='flex justify-between w-50  font-YekanBakh_Regular text-[15px]'>
          <div className='font-YekanBakh_Bold'>نام:</div>
          <div>{data[0].first_name}</div>
        </div>
        <div className='flex justify-between w-50  font-YekanBakh_Regular text-[15px]'>
          <div className='font-YekanBakh_Bold'>نام خانوادگی:</div>
          <div>{data[0].last_name}</div>
        </div>
        <div className='flex justify-between w-50  font-YekanBakh_Regular text-[15px]'>
          <div className='font-YekanBakh_Bold'>ایمیل:</div>
          <div>{data[0].email}</div>
        </div>
        <div className='flex justify-between w-50  font-YekanBakh_Regular text-[15px]'>
          <div className='font-YekanBakh_Bold'>نام کاربری:</div>
          <div>{data[0].username}</div>
        </div>
      </>
    )
  )
}

export default ProfileManager

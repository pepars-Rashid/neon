"use client"
import { handleCreateUser } from "@/app/action" 

export default function Button({onClick}) {

  
  return (
    <button onClick={handleCreateUser} className="size-[100px] border-2 border-yellow-200 bg-white">
      click me to insert data
    </button>
  )
}

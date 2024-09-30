"use client";
import { useFormState } from "react-dom";
import { useState } from "react";
import { handleForm } from "@/app/action";
import { updateName } from "@/app/action";

export default function MyForm() {
    const [addState, addAction] = useFormState(handleForm, { message: "" });
    const [updateState, updateAction] = useFormState(updateName, { message: "" });
    const [isFormVisible, setFormVisible] = useState(false);

    const handleButtonClick = () => {
        setFormVisible(!isFormVisible);
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="">
                <form action={addAction}>
                    <input type="text" name="name" placeholder="Enter your name" />
                    <button type="submit" name="zzzzzzzz" value={"1"}>Submit</button>
                    <p>{addState?.message}</p>
                </form>

                <button onClick={handleButtonClick}>
                    {isFormVisible ? 'Hide Form' : 'Update'}
                </button>
                {isFormVisible && (
                <form action={updateAction}>
                    <label>
                        Name:
                    <input type="text" name="name" />
                    <input type="hidden" name="constantValue" value="yourConstantValue" />
                    </label>
                    <button type="submit" name="id" value={1}>Submit</button>
                    <p>{updateState?.message}</p>
                </form>
                )}
            </div>
    </div>

    );
}


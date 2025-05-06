import React, { useState } from 'react'
import {HiMinPlus, HiOutlineTrash} from 'react-icons/hi';

const TodoListInput = ({todoList, setTodoList}) => {

    const [option, setOption] = useState("");

    // fungsi untuk menghandle menambahkan opsi 

    const handleAddOption = () => {
        if (option.trim()){
            setTodoList([...todoList, option.trim()]);
            setOption("");
        }
    };

    // fungsi untuk handle menghapus opsi
    const handleDeleteOption = (index) => {
        const updatedArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatedArr);
    };
  return (
    <div>
        {todoList.map((item, index) => (
            <div key={item}
            className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'>
                <p className='text-xs text-black'>
                    <span className='text-xs text-gray-400 font-semibold mr-2'>
                        {index < 9 ? `0${index = 1}` : index + 1}
                    </span>
                    {item}
                </p>

                <button className='cursor-poiter' onClick={() => {
                    handleDeleteOption(index);
                }}>
                    <HiOutlineTrash className='text-lg text-red-500' />
                </button>
            </div>
        ))}

        <div className=''>
            <input type="text" placeholder='Masukan Tugas' value={option} onChange={({target}) => setOption(target.value)} className='' />

            <button className='' onClick={handleAddOption}>
                <HiMinPlus className=''/>Tambah
            </button>
        </div>
    </div>
  )
}

export default TodoListInput
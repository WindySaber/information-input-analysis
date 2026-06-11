import { useState } from 'react'
import { getTodayDate } from '../src/utils/data.js';

export default function Notes() {
    const [showWindow,setShowWindow] = useState(false);
    const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || []);
    const [angle, setAngle] = useState(0);

    const WindowBody = (
        <div className="windowBody">
            <form className="addwindow" onSubmit={save}>
                <span className='note-top'>
                    <span>随时记录重要信息</span>
                    <button className='saveBtn' type='submit'>✓</button>
                </span>
                <div className="note-card">
                    <label>关键词：</label>
                    <input type="text" name='keyword' maxLength={20} />
                </div>
                <div className="note-card">
                    <label>一句话收获：</label>
                    <input type="text" name='summary' />
                </div>
                <div className="noteSelectAction note-card">
                    <label className='card-radio'>
                        <span>是否转行动：</span>
                        <label className='radio'>
                            <input type="radio" name="actionValue" value="true" /><span>是</span>
                        </label>
                        <label className='radio'>
                            <input type="radio" name="actionValue" value="false" /><span>否</span>
                        </label>
                    </label>
                </div>
            </form>
        </div>
    )

    function save(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItem = {
            id: Date.now(),
            date: getTodayDate(),
            keyword: formData.get('keyword'),
            summary: formData.get('summary'),
            actionValue: formData.get('actionValue')
        };

        if(newItem.keyword && newItem.summary && newItem.actionValue) {
            setNotes([...notes, newItem]);
            localStorage.setItem('notes', JSON.stringify([...notes, newItem]));
            setShowWindow(false);
            setAngle((angle + 45) % 360);
        }else {
            alert('请填写完整信息');
        }
    }


    return (
        <div className="notes">
            <section>
                <div className="addnote">
                    <button 
                        className="addBtn"
                        style={{transform: `rotate(${angle}deg)`}}
                        onClick = {() => {
                            setShowWindow(!showWindow);
                            setAngle((angle + 45) % 360);
                        }}
                    >➕</button>
                </div>
                {showWindow && WindowBody}
            </section>
        </div>
    );
}

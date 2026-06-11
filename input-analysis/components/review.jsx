import { useState } from 'react';
import { getTodayDate } from '../src/utils/data.js';

export default function Review() {
    const [showWindow,setShowWindow] = useState(false);
    const [reviews, setReviews] = useState(JSON.parse(localStorage.getItem('reviews')) || []);
    const [angle, setAngle] = useState(0);

    const WindowBody = (
        <div className="windowBody">
            <form className="addwindow" onSubmit={save}>
                <span className='note-top'>
                    <span>今日复盘</span>
                    <button className='saveBtn' type='submit'>✓</button>
                </span>
                <div className="note-card">
                    <label>今天最主要的信息类型关键词：</label>
                    <input type="text" name='keyword' />
                </div>
                <div className="note-card">
                    <label>今天最消耗我的信息来源：</label>
                    <input type="text" name='consume' />
                </div>
                <div className="note-card">
                    <label>今天最有价值的一条信息：</label>
                    <input type="text" name='valuable' />
                </div>
                <div className="note-card card-bottom">
                    <label>我想转成行动的一件事：</label>
                    <input type="text" name='action' />
                </div>
            </form>
        </div>
    );

    function save(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItem = {
            id: Date.now(),
            date: getTodayDate(),
            keyword: formData.get('keyword'),
            consume: formData.get('consume'),
            valuable: formData.get('valuable'),
            action: formData.get('action')
        };

        if(newItem.keyword && newItem.consume && newItem.valuable && newItem.action) {
            setReviews([...reviews, newItem]);
            setShowWindow(false);
            setAngle(angle + 45);
            localStorage.setItem('reviews', JSON.stringify([...reviews, newItem]));
        }else {
            alert('请填写完整信息');
        }
    }

    return (
        <div className="review">
            <section>
                <div className="addnote">
                    <button 
                        className='addBtn' 
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
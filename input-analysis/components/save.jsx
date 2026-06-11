import { getCurrentYear, getCurrentMonth, getCurrentDay } from '../src/utils/data.js';
import { useState } from 'react';

export default function Save() {
    const week = ['一', '二', '三', '四', '五', '六', '日'];

    const [year, setYear] = useState(getCurrentYear());
    const [month, setMonth] = useState(getCurrentMonth());
    const [day, setDay] = useState(getCurrentDay());

    const [notesHistory, setNotesHistory] = useState(JSON.parse(localStorage.getItem('notes')) || []);
    const [reviewsHistory, setReviewsHistory] = useState(JSON.parse(localStorage.getItem('reviews')) || []);

    const [showWindow, setShowWindow] = useState(false);
    const [window, setWindow] = useState();

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const CalendarTop = week.map((week) => {
        return <div className="block" key={week}>{week}</div>;
    });

    const CalendarBody = Array.from({ length: 42 }).map((_, index) => {
        const dayNum = index - firstDay + 1;

        return (
            dayNum > 0 && dayNum <= daysInMonth? (
                    <button
                        className={`block block-day ${
                            day === String(dayNum).padStart(2, '0') ? 'active-day' : ''
                        }`}
                        key={index}
                        value={String(dayNum).padStart(2, '0')}
                        onClick={() => {setDay(String(dayNum).padStart(2, '0'))}}
                    >
                        {String(dayNum).padStart(2, '0')}
                    </button>
                ): (
                    <div className="block" key={index}>&nbsp;</div>
                )
        );
    });

    const DailyNotesHistory = notesHistory.map((note, index) => (
        `${year}-${month}-${day}` === note.date && (
            <div className="note historycard phone-card" key={index}>
                <p className="note-top">
                    <span>#{note.keyword} {note.actionValue === 'true' ? '⭐️' : ''}</span>
                    <span className='note-top-btn'>
                        <button className="editBtn" onClick={() => editNoteWindow(note.id)}>编辑</button>
                        &nbsp;
                        <button className="deleteBtn" onClick={() => deleteNote(note.id)}>删除</button>
                    </span>
                </p>
                <p className="note-content">📝{note.summary}</p>
            </div>
        )
    ));

    const DailyReviewsHistory = reviewsHistory.map((review, index) => (
        `${year}-${month}-${day}` === review.date && (
            <div className="note historycard phone-card" key={index}>
                <p className="note-top">
                    <span>#今日复盘</span>
                    <span>
                        <button className="editBtn" onClick={() => editReviewWindow(review.id)}>编辑</button>
                        &nbsp;
                        <button className="deleteBtn" onClick={() => deleteNote(review.id)}>删除</button>
                    </span>
                </p>
                <p className="note-content">今日信息关键词是：{review.keyword}</p>
                <p className="note-content">今日消耗信源：{review.consume}</p>
                <p className="note-content">今日有价值信息：{review.valuable}</p>
                <p className="note-content">今日行动计划：{review.action}</p>
            </div>
        )
    ));

    function add() {
        setMonth(String(Number(month) + 1).padStart(2, '0'));

        if (month === '12') {
            setMonth('01');
            setYear(year + 1);
        }
    }

    function minus() {
        setMonth(String(Number(month) - 1).padStart(2, '0'));

        if (month === '01') {
            setMonth('12');
            setYear(year - 1);
        }
    }

    function editNoteWindow(id) {
        const newNotes = notesHistory.find(note => note.id === id);

        setWindow(
            <div className="pop-up">
                <form className="addwindow" onSubmit={(e) => saveNewnote(e, id)}>
                    <span className="note-top">
                        <span>随时记录重要信息</span>
                        <button className='saveBtn' type='submit'>✓</button>
                    </span>
                    <div className="note-card">
                        <label>关键词：</label>
                        <input type="text" name="keyword" defaultValue={newNotes.keyword} maxLength={20} />
                    </div>

                    <div className="note-card">
                        <label>一句话收获：</label>
                        <input type="text" name="summary" defaultValue={newNotes.summary} />
                    </div>

                    <div className="noteSelectAction note-card">
                         <label className="card-radio">
                            <span>是否转行动：</span>
                            <label className='radio'>
                                <input
                                    type="radio"
                                    name="actionValue"
                                    value="true"
                                    defaultChecked={newNotes.actionValue === 'true'}
                                />
                                <span>是</span>
                            </label>
                            <label className='radio'>
                                <input
                                    type="radio"
                                    name="actionValue"
                                    value="false"
                                    defaultChecked={newNotes.actionValue === 'false'}
                                />
                                <span>否</span>
                            </label>
                        </label>
                    </div>
                </form>
            </div>
        );

        setShowWindow(true);
    }

    function editReviewWindow(id) {
        const newReviews = reviewsHistory.find(review => review.id === id);

        setWindow(
            <div className="pop-up">
                <form className="addwindow" onSubmit={(e) => saveNewreview(e, id)}>
                    <span className='note-top'>
                        <span>复盘总结</span>
                        <button className='saveBtn' type='submit'>✓</button>
                    </span>
                    <div className="note-card">
                        <label>今天最主要的信息类型关键词：</label>
                        <input type="text" name='keyword' defaultValue={newReviews.keyword} />
                    </div>
                    <div className="note-card">
                        <label>今天最消耗我的信息来源：</label>
                        <input type="text" name='consume' defaultValue={newReviews.consume} />
                    </div>
                    <div className="note-card">
                        <label>今天最有价值的一条信息：</label>
                        <input type="text" name='valuable' defaultValue={newReviews.valuable} />
                    </div>
                    <div className="note-card card-bottom">
                        <label>我想转成行动的一件事：</label>
                        <input type="text" name='action' defaultValue={newReviews.action} />
                    </div>
                </form>
            </div>
        );

        setShowWindow(true);
    }

    function saveNewnote(e, id) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const keyword = formData.get('keyword');
        const summary = formData.get('summary');
        const actionValue = formData.get('actionValue');

        const newNotes = notesHistory.map((note) => {
            if (note.id === id) {
                return {
                    ...note,
                    keyword,
                    summary,
                    actionValue
                };
            }

            return note;
        });

        if (keyword && summary && actionValue) {
            setNotesHistory(newNotes);
            localStorage.setItem('notes', JSON.stringify(newNotes));
            setShowWindow(false);
        } else {
            alert('请填写完整信息');
        }
    }

    function saveNewreview(e, id) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const keyword = formData.get('keyword');
        const consume = formData.get('consume');
        const valuable = formData.get('valuable');
        const action = formData.get('action');

        const newReciews = reviewsHistory.map((review) => {
            if (review.id === id) {
                return {
                    ...review,
                    keyword,
                    consume,
                    valuable,
                    action
                };
            }
            return review;
        });

        if (keyword && consume && valuable && action) {
            setReviewsHistory(newReciews);
            localStorage.setItem('reviews', JSON.stringify(newReciews));
            setShowWindow(false);
        } else {
            alert('请填写完整信息');
        }
    }

    function deleteNote(id) {
        const newNotes = notesHistory.filter(note => note.id !== id);
        setNotesHistory(newNotes);
        localStorage.setItem('notes', JSON.stringify(newNotes));

        const newReviews = reviewsHistory.filter(review => review.id !== id);
        setReviewsHistory(newReviews);
        localStorage.setItem('reviews', JSON.stringify(newReviews));
    }

    function exportData() {
        const data = {
            version: 1,
            exportedAt: new Date().toISOString(),
            notes: JSON.parse(localStorage.getItem('notes') || '[]'),
            reviews: JSON.parse(localStorage.getItem('reviews') || '[]')
        }

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'input-analysis-backup.json';
        a.click();

        URL.revokeObjectURL(url);
    }

    function importData(e) {
        const file = e.target.files[0];

        if(!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);

                if(!Array.isArray(data.notes) || !Array.isArray(data.reviews)) {
                    alert('文件格式不正确');
                    return;
                }

                const importedNotes = data.notes.filter(note => note.id);
                const importedReviews = data.reviews.filter(review => review.id);

                const mergedNotes = [
                    ...notesHistory,
                    ...importedNotes.filter(importedNote => (
                        !notesHistory.some(note => note.id === importedNote.id)
                    ))
                ];

                const mergedReviews = [
                    ...reviewsHistory,
                    ...importedReviews.filter(importedReview => (
                        !reviewsHistory.some(review => review.id === importedReview.id)
                    ))
                ];

                localStorage.setItem('notes', JSON.stringify(mergedNotes));
                localStorage.setItem('reviews', JSON.stringify(mergedReviews));

                setNotesHistory(mergedNotes);
                setReviewsHistory(mergedReviews);

                alert('导入成功');
            } catch {
                alert('导入失败，文件不是有效 JSON');
            }
        }

        reader.readAsText(file);
    }



    return (
        <div className="save">
            <div className="saveBody">
                <div className="calendar">
                    <div className='historyTitle'>
                        <span>历史记录</span>
                        <div className='his-btn'>
                            <label className='json-out' onClick={() => exportData()}>导出</label>
                            <label className='json-in'>
                                导入
                                <input type="file" accept='application/json' onChange={importData} hidden />
                            </label>      
                        </div>
                    </div>
                    <span className="sildetitle">
                        <span className="leftBtn" onClick={minus}>
                            ＜&nbsp;
                        </span>
                        {year}年{month}月
                        <span className="rightBtn" onClick={add}>
                            &nbsp;＞
                        </span>
                    </span>
                    <div className="blockGrid">
                        {CalendarTop}
                        {CalendarBody}
                    </div>
                </div>
                {showWindow && window}
                <div className="dailyHistory">
                    <span className='todayDate'>{`${year}-${month}-${day}`}</span>
                    {DailyNotesHistory}
                    {DailyReviewsHistory}
                </div>
            </div>
        </div>
    );
}

import React, {useContext, useEffect, useState} from 'react'
import {Link, Navigate} from 'react-router-dom'
import '../css/menuindex.css';
import MenuItem from './MenuItem';
import { MemberInfoContext } from '../components/MemberInfoContext';
import { LocalHostInfoContext } from '../components/LocalHostInfoContext';

const MenuIndex = () => {
    const memberInfo = useContext(MemberInfoContext);
    const[menus,setMenus] = useState([]);
    const [lengthOfMenus, setLengthOfMenus] = useState(0);
    useEffect(() => {
        handleSubmit(1);
    },[]);


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const pageScale = 5;
    const [isActive, setIsActive] = useState(false);
    
    // 현재 페이지에 해당하는 데이터 계산
    const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
    // const currentItems = menus.slice(indexOfFirstItem, indexOfLastItem); // 배열에 현재 페이지에 해당하는 아이템 잘라내어 가져옴.
    
     const pageNumbers = [];
     const totalPage = Math.ceil(lengthOfMenus / itemsPerPage); // 전체 페이징 수
     const totalPageScale = Math.ceil(totalPage/pageScale); //  총 페이지 수
     const pageNum = Math.ceil(currentPage/pageScale); // 페이지 번호
     const startPage = pageScale * (pageNum - 1) + 1; // 페이지 시작 번호
     const nextPage = pageNum * pageScale +1; // 다음 페이지 시작 번호
     const prevPage = nextPage - pageScale -1; // 이전 페이지 
    
    for (let i = startPage; i<= startPage+pageScale-1; i++) {
        if(i <= totalPage){
            pageNumbers.push(i);
        }
    }
    
    const handleSubmit = (number) => {
        
        const indexOfLastItem = number * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setIndexOfFirstItem(indexOfFirstItem);
        setIsActive(number);
        setCurrentPage(number);
        fetch(`${LocalHostInfoContext.common}/api/menupagelist`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify({
                itemsPerPage: itemsPerPage,   // 한 페이지당 아이템 개수
                indexOfFirstItem: indexOfFirstItem // 현재 페이지의 첫 번째 아이템 인덱스
            })
        })
        .then((res) => res.json())
        .then((res)=>{
            setMenus(res.menuList);
            setLengthOfMenus(res.menuTotal);
        });
        
    };

    if(memberInfo.loading) {
        return <div>로딩 중...</div>
    }

    if(!memberInfo.email) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/lgn/Lgn" replace />
    }

    if(memberInfo.grade != 3) {
        alert("권한이 없습니다.");
        return <Navigate to="/" replace />
    }
    
    return (
        <div class="content">
            <h2>메뉴관리</h2>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>메뉴명</th>
                        <th>링크</th>
                        <th>권한</th>
                        <th>사용여부</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {menus.map((menu,index)=>(
                        <MenuItem key={menu.no} menu={menu} index={indexOfFirstItem+index+1}/>
                    ))}
                </tbody>
            </table>
            <button type="button"><Link to="/menu/MenuReg">등록</Link></button>
           
            <div class="pagination">
                <a href="#" onClick={()=>pageNum > 1 ? handleSubmit(prevPage):''}>&laquo;</a>
                {pageNumbers.map(number =>(
                    <a href="#" class={isActive === number ? 'active' : ''} key={number} onClick={()=>handleSubmit(number)}>{number}</a>
                ))}
                <a href="#" onClick={()=>pageNum < totalPageScale ? handleSubmit(nextPage): ''}>&raquo;</a>
            </div>
            
        </div>
    );
};

export default MenuIndex;
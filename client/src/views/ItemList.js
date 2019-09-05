import React from 'react'
import RowView from './RowView'
import './ItemList.scss'

function ItemList(props) {
    return (
        <>
            <div className='item-list-header'>
                <p>{ props.movies ? props.movies.length : '0' } results</p>
            </div>
            <RowView row={{ title: 'My List', movies: props.movies ? props.movies : [] }} showRowHeader={false} />
        </>
    )
}

export default ItemList
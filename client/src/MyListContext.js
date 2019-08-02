import React from 'react'

const MyListContext = React.createContext()

export const MyListProvider = MyListContext.Provider
export const MyListConsumer = MyListContext.Consumer
export default MyListContext
import type {PageInfoType} from "~/types";

export function pageCalculator({ currentPage, visiblePagesAmount, totalPages }: PageInfoType) {
    const pageArr = []
    let startPage = Math.max(currentPage - Math.floor(visiblePagesAmount / 2), 2)
    const endPage = Math.min(startPage + visiblePagesAmount - 2, totalPages - 1)

    if (startPage > 2) {
        if(totalPages >= currentPage && totalPages > visiblePagesAmount)
            pageArr.push('...')
        if(totalPages - startPage < visiblePagesAmount) {
            startPage = totalPages - visiblePagesAmount + 1
        } else startPage++
    }

    for (let i = startPage; i <= endPage; i++) {
        pageArr.push(i)
    }

    if(totalPages - startPage < visiblePagesAmount ) {
        pageArr.push(endPage + 1)
    }
    if (endPage < totalPages - 1 && !(totalPages - startPage < visiblePagesAmount) ) {
        pageArr.push('...')
    }

    if (totalPages > 1) {
        if(pageArr[0] !== 1)
            pageArr.unshift(1)
        if(pageArr[pageArr.length - 1] === '...' || pageArr[pageArr.length - 1] === totalPages - 1 )
            pageArr.push(totalPages)
    }

    return pageArr
}
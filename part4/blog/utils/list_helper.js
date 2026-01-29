const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const countLikes = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(countLikes, 0)
}

const favouriteBlog = (blogs) => {
    if (blogs.length === 0) return {}
    return blogs.reduce((max, curr) => {
        return (curr.likes > max.likes) ? curr : max
    })
}

const mostBlogs = (blogs) => {
    const counter = new Map()

    for (let blog of blogs) {
        const key = blog.author
        if (counter.has(key)) {
            counter.set(key, counter.get(key) + 1)
        } else {
            counter.set(key, 1)
        }
    }

    const [author, num] = [...counter].reduce((a, b) => b[1] > a[1] ? b : a)
    return {
        author,
        blogs: num
    }
}

const mostLikes = (blogs) => {
    const counter = new Map()

    for (let blog of blogs) {
        const key = blog.author
        if (counter.has(key)) {
            counter.set(key, counter.get(key) + blog.likes)
        } else {
            counter.set(key, blog.likes)
        }
    }

    const [author, likes] = [...counter].reduce((a, b) => b[1] > a[1] ? b : a)
    return {
        author,
        likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}


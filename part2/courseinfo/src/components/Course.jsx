const Header = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  )

}

const Content = (props) => {
    return (
    <div>
        {props.parts.map(note => 
        <ul key={note.name}>
            {note.name} {note.exercises}
        </ul>
        )}
    </div>
  )
}

const Total = (props) => {
    const sum = props.parts.reduce((accumulator, currVal) => {
        return accumulator + currVal.exercises;
    }, 0)
    return (
        <div>
        <ul>Number of exercises {sum}</ul>
        </div>
    )
}

const Course = ({ name, parts }) => {
    console.log('inside individual course')
    return (
        <div>
        <Header name={name} />
        <Content parts={parts} />
        <Total parts={parts} />
        </div>
    )
}
const Courses = ({ courses }) => {
    console.log('inside cumulative courses')
    return (
        courses.map(course => (
            <Course key={course.id} name={course.name} parts={course.parts}></Course>
        ))
    )
}

export default Courses
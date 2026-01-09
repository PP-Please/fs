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
//   return (
//     <div>
//       <p>{props.parts[0].name} {props.parts[0].exercises}</p>
//       <p>{props.parts[1].name} {props.parts[1].exercises}</p>
//       <p>{props.parts[2].name} {props.parts[2].exercises}</p>
//     </div>
//   )
}

const Total = (props) => {
const sum = props.parts.reduce((accumulator, currVal) => {
    return accumulator + currVal.exercises;
}, 0)
// console.log(sum)
  return (
    <div>
      <ul>Number of exercises {sum}</ul>
    </div>
  )
}

const Course = ({ course }) => {
    return (
        <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
        </div>
    )
}

export default Course
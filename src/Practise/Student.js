function Student(props)
{
console.log(props)
return(
    
<div>
    <h1>
        Hello {props.name}
    </h1>
    
</div>
)
}

export default Student;
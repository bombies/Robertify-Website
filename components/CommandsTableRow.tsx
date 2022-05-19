export default function CommandsTableRow({ id, name, description, category }) {
    return (
        <tr key={id} className='commands_table--row'>
            <td className='commands_table--row--data'>{name}</td>
            <td className='commands_table--row--data'>{description}</td>
            <td className='commands_table--row--data'>{category}</td>
        </tr>
    )
}
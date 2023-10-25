import { useHistory } from 'react-router-dom'

const Navbar = (props) => {
    const usertype = props.usertype
    const history = useHistory()

    return (  
        <div className = "Navbar">
            <button key="Profile" onClick={() => {history.push('/profile')}}>Home</button><br/>
            {(usertype=="admin") && [<button key="Construct" onClick={() => {history.push('/profile/construct')}}>Construct</button>,<br/>]}
            {(usertype=="admin") && [<button key="Destruct" onClick={() => {history.push('/profile/destruct')}}>Destruct</button>,<br/>]}
            {(usertype=="patient") && [<button key="Grant" onClick={() => {history.push('/profile/grant')}}>Grant</button>,<br/>]}
            {(usertype=="patient") && [<button key="Revoke" onClick={() => {history.push('/profile/revoke')}}>Revoke</button>,<br/>]}
            <button key="Read" onClick={() => {history.push('/profile/read')}}>Read</button><br/>
            {(usertype=="admin") && [<button key="Write" onClick={() => {history.push('/profile/write')}}>Write</button>,<br/>]}
            {(usertype=="patient") && [<button key="Purge" onClick={() => {history.push('/profile/purge')}}>Purge</button>,<br/>]}
        </div>
    );
}

export default Navbar;

import '../../css/footer.css'

function Footer(){
    return (
        <footer className='footer-container'>
            <div className='footer-content'>
                <p>&copy; {new Date().getFullYear()} Eclipse</p>
            </div>
        </footer>
    );
}
 
export default Footer
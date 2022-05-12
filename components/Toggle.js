export default function Toggle({ className = 'toggleComponent', label, subTitle = null, isActive, setActive }) {
    return (
        <div className={`${className}Container ${isActive && 'active'}`}>
            <div className={`${className} toggleDesc`}>
                <p className={`${className} toggleDesc-label`}>{label}</p>
                {subTitle && <p className={`${className} toggleDesc-subTitle`}>{subTitle}</p>}
            </div>
            <div className={`toggle ${isActive && 'active'}`} onClick={setActive}>
                 <div className={`toggle-knob ${isActive && 'active'}`}></div>
            </div>
        </div>
    )
}
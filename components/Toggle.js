export default function Toggle({ 
    className = 'toggleComponent', label, subTitle = null,
     isActive, setActive, isDisabled = false, isPremium = false
}) {
    return (
        <div className={`${className}Container ${isActive && 'active'}`}>
            <div className={`${className} toggleDesc`}>
                <p className={`${className} toggleDesc-label`}>{label} {isPremium && <span className='banner-tiny bg-green pointer-noEvents marin-left-sm font-med'>Premium</span>}</p>
                {subTitle && <p className={`${className} toggleDesc-subTitle`}>{subTitle}</p>}
            </div>
            <div className={`toggle ${isActive && 'active'} ${isDisabled && 'cursor-notAllowed'}`} onClick={setActive}>
                 <div className={`toggle-knob ${isActive && 'active'} ${isDisabled && 'cursor-notAllowed'}`}></div>
            </div>
        </div>
    )
}
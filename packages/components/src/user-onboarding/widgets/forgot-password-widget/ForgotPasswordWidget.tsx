import ForgotPasswordForm from "./ForgotPasswordForm";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";

export default function ForgotPasswordWidget() {
    return <UserOnboardingWidgetContainer>
        <div className="flex flex-row w-full items-center justify-between">
            <div className="flex flex-row items-center">
                <div className="flex flex-col gap-[32px]"> 
                    <div className="flex flex-col gap-[8px]">
                        <h2>Forgot password?</h2>
                        <p>No worries! Enter your account email address to reset. </p>
                    </div>
                        <ForgotPasswordForm/>
                        
                    
                </div>
            </div>
            <div className="bg-good-dog-main w-1/2 h-full">

            </div>
         </div>
       
    </UserOnboardingWidgetContainer>
}
import { SurveyForm } from '../components/survey/SurveyForm'
import { SITE } from '../config/site'

export default function SurveyPage() {
  return (
    <div className="bg-slate-50">
      <div className="container-page max-w-3xl pt-10 text-center sm:pt-14">
        <span className="section-eyebrow">全国文化祭アンケート</span>
        <h1 className="mt-4 text-3xl font-black text-ink sm:text-4xl">
          文化祭運営の実態を教えてください
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          回答時間は約{SITE.surveyMinutes}分です。匿名で回答でき、個人情報の入力は任意です。
          あなたの声が、これからのサービス開発に活かされます。
        </p>
      </div>
      <SurveyForm />
    </div>
  )
}

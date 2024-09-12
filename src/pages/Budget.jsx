import TabsTimePeriod from '../components/TabsTimePeriod'
import PieChart from '../components/PieChart'
import TableDailyExpenses from '../components/TableDailyExpenses'
import { BudgetContextWrapper } from '../context/budget.context'

export default function Budget() {
	// const { dataLoaded, existingBudget, existingDailyExpenses } = useContext(BudgetContext)

	// if (dataLoaded && (!existingBudget || (existingBudget.earnings.length === 0 && !existingDailyExpenses))) {
	// 	return <>please set a budget first</>
	// } else if (dataLoaded && existingBudget) {
	return (
		<>
			<BudgetContextWrapper>
				<h1>Your Budget</h1>
				<TabsTimePeriod />
				<PieChart />
				<TableDailyExpenses />
			</BudgetContextWrapper>
		</>
	)
	// }
}

import {screen, render} from "@testing-library/react"
import React from "react"
import UserOverview from "../components/users/UserOverview"

const users = [
    {id: 8,
        username:"admin",
        role:"admin"
    }
]
window.React = React
test("given users, when clicking on users, then all users are shown", () => {
    //when:
    render(<UserOverview users={users}/>)
    //then:
    expect(screen.getByText("admin"))
})

test("renders 'No Active Users' when no users are provided", () => {
    render(<UserOverview users={[]} />);
    expect(screen.getByText("No Active Users"));
  });
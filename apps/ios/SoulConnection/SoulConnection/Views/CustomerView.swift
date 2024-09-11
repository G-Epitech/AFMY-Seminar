//
//  CustomerView.swift
//  SoulConnection
//
//  Created by Matheo Coquet on 11/09/2024.
//

import SwiftUI

struct CustomerView: View {
    @State var customer: Customer
    
    private func getDateString(text: String) -> String {
        var newText = text.dropLast(5)
        newText += "+0Z"
        
        let date = ISO8601DateFormatter().date(from: String(newText))
        let dateFormatter = DateFormatter()

        dateFormatter.dateFormat = "dd/MM/YYYY"
        return dateFormatter.string(from: date ?? Date())
    }

    var body: some View {
        Form {
            Section {
                HStack {
                    ImageView(urlString: "http://127.0.0.1:4000\(customer.photo!)")
                        .frame(width: 70, height: 70)
                        .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                        .overlay {
                            Circle().stroke(.white, lineWidth: 4)
                        }
                        .shadow(radius: 7)
                        .padding(.trailing)
                    Text("\(customer.name) \(customer.surname)")
                        .font(.title2)
                }
            }
 
            Section {
                HStack {
                    Image(systemName: "envelope")
                    Text("Email")
                    Spacer()
                    Link(customer.email, destination: URL(string: "mailto://\(customer.email)")!)
                }
                HStack {
                    Image(systemName: "phone")
                    Text("Phone")
                    Spacer()
                    Link(customer.phone ?? "No phone", destination: URL(string: "tel://\(customer.phone ?? "#")")!)
                }
            }
            
            Section {
                VStack {
                    HStack {
                        Text("Description:")
                            .foregroundStyle(.secondary)
                        Spacer()
                    }
                    Divider()
                    HStack {
                        Text(customer.description)
                        Spacer()
                    }
                }
            }
            
            Section {
                HStack {
                    Image(systemName: "birthday.cake")
                    Text("Birthday")
                    Spacer()
                    Text(getDateString(text: customer.birthDate))
                }
                HStack {
                    Image(systemName: "person.badge.plus")
                    Text("User creation")
                    Spacer()
                    Text(getDateString(text: customer.createdAt))
                }
            }
            
            Section {
                HStack {
                    Image(systemName: "mappin.circle")
                    Text("Address")
                    Spacer()
                    Text(customer.address ?? "Not provided")
                }
                HStack {
                    Image(systemName: "map")
                    Text("Country")
                    Spacer()
                    Text(customer.country ?? "Not provided")
                }
            }
        }
    }
}

#Preview {
    CustomerView(customer: Customer(id: 1, email: "matheocoquet@gmail.com", name: "Matheo", surname: "Coquet", description: "The navigation changes only have an effect when the view is part of a navigation stack.", birthDate: "23/06/2004", gender: "M", sign: "aa", phone: "0783844542", photo: "/images/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzI2MDU3MTQxLCJleHAiOjE3MjYwNTc3NDF9.7nUp6JGWMIvNtmHGpJ7nzd-cTiXM_d4vtGOgPNjmwL4", createdAt: "2016-04-14T10:44:00.0000Z"))
}

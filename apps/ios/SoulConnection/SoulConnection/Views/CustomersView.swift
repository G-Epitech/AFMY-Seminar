//
//  CustomersView.swift
//  SoulConnection
//
//  Created by Matheo Coquet on 11/09/2024.
//

import SwiftUI

struct CustomersView: View {
    @State var token: String
    
    @State private var customers: [Customer] = []
    @State private var page = 0
    @State private var lastPage = false
    
    init(token: String) {
        UINavigationBar.appearance().largeTitleTextAttributes = [.foregroundColor: UIColor.orange]
        
        self.token = token
    }
    
    var body: some View {
        NavigationSplitView {
            Form {
                List(customers, id: \.id) { customer in
                    NavigationLink {
                        CustomerView(customer: customer)
                    } label: {
                        CustomerRow(customer: customer)
                    }
                }
                if (lastPage == false) {
                    Button("Load more") {
                        Task {
                            page += 1
                            await getCustomers(page: page)
                        }
                    }.foregroundStyle(Color.orange).bold()
                }
            }.navigationTitle("Customers")
        } detail: {
            Text("Select a customer")
        }.task {
            await getCustomers(page: 0)
        }
    }
    
    private func getCustomers(page: Int) async {
        do {
            let result = try await listCustomersAPI(token: token, page: page)
            self.customers += result.items
            
            self.lastPage = result.isLast
        } catch {
            print(error.localizedDescription)
        }
    }
}
